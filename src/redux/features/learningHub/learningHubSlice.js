// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axiosInstance from '../../http';
import { logoutUser } from '../auth/authSlice';

// Content type values from backend (content_registry enums) - normalized to lowercase for comparison
const CONTENT_TYPE_MICRO_COURSE = 'micro_course';
const CONTENT_TYPE_AI_GUIDED_TUTORIAL = 'ai_guided_tutorial';
const CONTENT_TYPE_LEARNING_PATH = 'learning_path';

/** Normalize content_type for case- and whitespace-safe filtering. Backend may return MICRO_COURSE etc. */
const normalizeContentType = (ct) => (ct != null && String(ct).trim() ? String(ct).toLowerCase().trim() : '');

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const detail = error?.response?.data?.detail;
  const message =
    (typeof detail === 'string' ? detail : null) ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Format estimated_duration_min as "X min"
const formatDuration = (estimatedMin) => {
  if (estimatedMin == null || estimatedMin === '') return '';
  const n = Number(estimatedMin);
  if (Number.isNaN(n) || n < 0) return '';
  return `${n} min`;
};

// ---------- Transform functions: backend home payload -> UI view models ----------

/**
 * @param {Object} homePayload - Raw GET /api/v1/learning-hub/home response
 * @param {Map<string, { progress_percent: number, completed_sessions: number }>} [progressMap] - optional progress per content_id
 * @returns {Array} UI shape: { title, duration, category, progress, difficulty, contentId?, route?, reason?, score? }
 */
const transformMicroCourses = (homePayload, progressMap = new Map()) => {
  if (!homePayload?.primary_recommendations && !homePayload?.secondary_recommendations) return [];
  const primary = homePayload.primary_recommendations || [];
  const secondary = homePayload.secondary_recommendations || [];
  const all = [...primary, ...secondary];
  const seenFingerprints = new Set();
  const filtered = all.filter((card) => {
    if (!card) return false;
    const ct = normalizeContentType(card.content_type);
    if (!(ct === CONTENT_TYPE_MICRO_COURSE || ct === CONTENT_TYPE_LEARNING_PATH)) return false;
    const fp = `${ct}|${String(card.category || '').toLowerCase().trim()}|${String(card.title || '').toLowerCase().trim()}`;
    if (seenFingerprints.has(fp)) return false;
    seenFingerprints.add(fp);
    return true;
  });
  return filtered.map((card) => {
    const summary = card?.content_id ? progressMap.get(card.content_id) : undefined;
    const progress = summary != null && Number.isFinite(summary.progress_percent) ? summary.progress_percent : 0;
    return {
      title: card.title || '',
      duration: formatDuration(card.estimated_duration_min),
      category: card.category || 'Learning',
      progress,
      difficulty: card.difficulty || 'Beginner',
      contentId: card.content_id,
      contentType: normalizeContentType(card.content_type),
      contentSlug: card.content_slug || null,
      delivery: card.delivery || null,
      route: card.route,
      reason: card.reason,
      score: card.score,
    };
  });
};

/**
 * @param {Object} homePayload
 * @param {Map<string, { progress_percent: number, completed_sessions: number }>} [progressMap]
 * @returns {Array} UI shape: { title, type, duration, completed, contentId?, route?, reason?, score? }
 */
const transformTutorials = (homePayload, progressMap = new Map()) => {
  if (!homePayload?.primary_recommendations && !homePayload?.secondary_recommendations) return [];
  const primary = homePayload.primary_recommendations || [];
  const secondary = homePayload.secondary_recommendations || [];
  const all = [...primary, ...secondary];
  const seenFingerprints = new Set();
  const filtered = all.filter((card) => {
    if (!card) return false;
    const ct = normalizeContentType(card.content_type);
    if (ct !== CONTENT_TYPE_AI_GUIDED_TUTORIAL) return false;
    const fp = `${ct}|${String(card.category || '').toLowerCase().trim()}|${String(card.title || '').toLowerCase().trim()}`;
    if (seenFingerprints.has(fp)) return false;
    seenFingerprints.add(fp);
    return true;
  });
  return filtered.map((card) => {
    const summary = card?.content_id ? progressMap.get(card.content_id) : undefined;
    const completed =
      summary != null &&
      (Number(summary.progress_percent) >= 100 || Number(summary.completed_sessions) > 0);
    return {
      title: card.title || '',
      type: card.category || 'Step-by-step walkthrough',
      duration: formatDuration(card.estimated_duration_min),
      completed: !!completed,
      contentId: card.content_id,
      contentType: normalizeContentType(card.content_type),
      contentSlug: card.content_slug || null,
      delivery: card.delivery || null,
      route: card.route,
      reason: card.reason,
      score: card.score,
    };
  });
};

/**
 * @param {Object} homePayload
 * @returns {Array} UI shape: { skill, reason, impact, estimatedTime, route?, contentId?, contentType?, contentSlug?, delivery? }
 */
const transformAIRecommendations = (homePayload) => {
  const focusAreas = homePayload?.focus_areas || [];
  const nextActions = homePayload?.next_actions || [];
  const cards = [
    ...(homePayload?.primary_recommendations || []),
    ...(homePayload?.secondary_recommendations || []),
  ];
  const result = [];
  const usedLabels = new Set();
  const norm = (v) => String(v || '').toLowerCase().trim();
  const tokenize = (v) => norm(v).split(/[^a-z0-9]+/g).filter(Boolean);
  const cardTokens = cards.map((card) => {
    const blob = [
      card?.title,
      card?.subtitle,
      card?.summary,
      card?.category,
      card?.content_type,
      card?.content_slug,
    ]
      .filter(Boolean)
      .join(' ');
    return {
      card,
      tokenSet: new Set(tokenize(blob)),
    };
  });

  const pickCardForSkill = (skill, hintReason) => {
    const skillTokens = new Set(tokenize(skill));
    const reasonTokens = new Set(tokenize(hintReason));
    let best = null;
    let bestScore = -1;
    cardTokens.forEach(({ card, tokenSet }) => {
      let score = 0;
      skillTokens.forEach((t) => {
        if (tokenSet.has(t)) score += 3;
      });
      reasonTokens.forEach((t) => {
        if (tokenSet.has(t)) score += 1;
      });
      if (score > bestScore) {
        best = card;
        bestScore = score;
      }
    });
    // Require at least one meaningful overlap; otherwise no forced map
    return bestScore > 0 ? best : null;
  };

  // Prefer focus_areas (title = skill), then fill with next_actions (label = skill, reason = reason)
  for (const fa of focusAreas) {
    if (result.length >= 3) break;
    const title = fa.title || '';
    if (!title || usedLabels.has(title)) continue;
    usedLabels.add(title);
    const priority = fa.priority != null ? fa.priority : 1;
    const impact = priority === 1 ? 'High' : priority === 2 ? 'Medium' : 'Low';
    const reason =
      nextActions.find((na) => na.label === title)?.reason ||
      'Recommended based on your learning profile.';
    const mappedCard = pickCardForSkill(title, reason);
    result.push({
      skill: title,
      reason,
      impact,
      estimatedTime: '1–2 hours',
      route: mappedCard?.route,
      contentId: mappedCard?.content_id,
      contentType: normalizeContentType(mappedCard?.content_type),
      contentSlug: mappedCard?.content_slug || null,
      delivery: mappedCard?.delivery || null,
    });
  }
  for (const na of nextActions) {
    if (result.length >= 3) break;
    const label = na.label || '';
    if (!label || usedLabels.has(label)) continue;
    usedLabels.add(label);
    const mappedCard = pickCardForSkill(label, na.reason || '');
    result.push({
      skill: label,
      reason: na.reason || 'Suggested next step for your growth.',
      impact: 'Medium',
      estimatedTime: '1–2 hours',
      route: mappedCard?.route,
      contentId: mappedCard?.content_id,
      contentType: normalizeContentType(mappedCard?.content_type),
      contentSlug: mappedCard?.content_slug || null,
      delivery: mappedCard?.delivery || null,
    });
  }
  return result;
};

/**
 * Backend home payload does not yet provide certificate objects. Return empty array.
 * @param {Object} _homePayload
 * @returns {Array} UI shape: { name, date, hours, badge }
 */
const transformCertificates = (_homePayload) => {
  return [];
};

/**
 * @param {Object} homePayload
 * @returns {Object} UI shape: { coursesCompleted, hoursLogged, certificatesEarned, currentStreak }
 */
const transformProgressStats = (homePayload) => {
  const overview = homePayload?.progress_overview;
  if (!overview) {
    return {
      coursesCompleted: 0,
      hoursLogged: 0,
      certificatesEarned: 0,
      currentStreak: 0,
    };
  }
  const totalMinutes = Number(overview.total_learning_minutes) || 0;
  const hoursLogged = Math.round((totalMinutes / 60) * 10) / 10;
  return {
    coursesCompleted: Number(overview.completed_content_count) || 0,
    hoursLogged,
    certificatesEarned: 0,
    currentStreak: 0,
  };
};

// ---------- Initial state ----------
const initialState = {
  home: null,
  microCourses: [],
  tutorials: [],
  aiRecommendations: [],
  certificates: [],
  progressStats: {
    coursesCompleted: 0,
    hoursLogged: 0,
    certificatesEarned: 0,
    currentStreak: 0,
  },
  loading: false,
  error: null,
};

/**
 * Fetch progress for multiple content ids. Returns Map<content_id, { progress_percent, completed_sessions }>.
 * Failed requests do not fail the whole flow; missing entries default to 0 / false in transforms.
 */
async function fetchContentProgressMap(contentIds) {
  if (!Array.isArray(contentIds) || contentIds.length === 0) return new Map();
  const unique = [...new Set(contentIds.filter((id) => id != null && String(id).trim()))];
  const results = await Promise.allSettled(
    unique.map((contentId) =>
      axiosInstance.get(`/api/v1/learning-progress/content/${encodeURIComponent(contentId)}/progress`)
    )
  );
  const map = new Map();
  results.forEach((outcome, i) => {
    const contentId = unique[i];
    if (!contentId) return;
    if (outcome.status === 'fulfilled' && outcome.value?.data) {
      const d = outcome.value.data;
      map.set(contentId, {
        progress_percent: Number(d.progress_percent) || 0,
        completed_sessions: Number(d.completed_sessions) || 0,
      });
    }
  });
  return map;
}

// ---------- Async thunk ----------
export const fetchLearningHubHome = createAsyncThunk(
  'learningHub/fetchLearningHubHome',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/learning-hub/home');
      const data = response.data;
      const primary = data?.primary_recommendations || [];
      const secondary = data?.secondary_recommendations || [];
      const allCards = [...primary, ...secondary];
      const contentIds = allCards.map((c) => c?.content_id).filter(Boolean);
      let progressMap = new Map();
      try {
        progressMap = await fetchContentProgressMap(contentIds);
      } catch (progressErr) {
        console.warn('[learningHubSlice] Progress enrichment failed, using base data:', progressErr);
      }
      return {
        home: data,
        microCourses: transformMicroCourses(data, progressMap),
        tutorials: transformTutorials(data, progressMap),
        aiRecommendations: transformAIRecommendations(data),
        certificates: transformCertificates(data),
        progressStats: transformProgressStats(data),
      };
    } catch (error) {
      console.error('[learningHubSlice] Error fetching Learning Hub home:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Slice ----------
const learningHubSlice = createSlice({
  name: 'learningHub',
  initialState,
  reducers: {
    clearLearningHubError: (state) => {
      state.error = null;
    },
    resetLearningHub: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearningHubHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningHubHome.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.home = action.payload.home;
        state.microCourses = action.payload.microCourses || [];
        state.tutorials = action.payload.tutorials || [];
        state.aiRecommendations = action.payload.aiRecommendations || [];
        state.certificates = action.payload.certificates || [];
        state.progressStats = action.payload.progressStats || initialState.progressStats;
      })
      .addCase(fetchLearningHubHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load Learning Hub';
      })
      .addCase(logoutUser, () => initialState);
  },
});

export const { clearLearningHubError, resetLearningHub } = learningHubSlice.actions;
export default learningHubSlice.reducer;
