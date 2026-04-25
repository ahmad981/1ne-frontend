import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ProfessionalLearningHub from './ProfessionalLearningHub'

const mockUseSelector = vi.fn()
const mockDispatch = vi.fn()
const mockNavigate = vi.fn()
const mockHubData = vi.fn()
const mockPersonalizationStatus = vi.fn()

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => mockUseSelector(selector),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../features/learningHub', () => ({
  buildLearningHubSectionPath: (_section: string, slug?: string) => `/learning-hub/${slug || ''}`,
  learningHubData: [],
}))

vi.mock('../../features/learningHub/ProfileCompletionGate', () => ({
  ProfileCompletionGate: () => <div>PROFILE_COMPLETION_GATE</div>,
}))

vi.mock('../../features/learningHub/useLearningHubScrollToTop', () => ({
  useLearningHubRouteScrollToTop: () => {},
}))

vi.mock('../../hooks/usePersonalizationStatus', () => ({
  usePersonalizationStatus: () => mockPersonalizationStatus(),
}))

vi.mock('../../hooks/useLearningHubHomeData', () => ({
  useLearningHubHomeData: () => mockHubData(),
}))

vi.mock('../../hooks/useHubBootstrapOrchestration', () => ({
  useHubBootstrapOrchestration: () => ({ bootstrapPollingActive: false }),
}))

vi.mock('../../hooks/usePersonalizationPoller', () => ({
  usePersonalizationPoller: () => {},
}))

vi.mock('../../hooks/useActivityTracker', () => ({
  useActivityTracker: () => ({ trackCardClick: vi.fn(), trackContentStart: vi.fn() }),
}))

describe('ProfessionalLearningHub gating', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDispatch.mockReturnValue(vi.fn())
    mockUseSelector.mockImplementation((selector) =>
      selector({
        personalization: {
          hubBootstrap: {
            show_bootstrap_banner: true,
            has_ready_inventory: false,
            can_enter_hub: false,
            progress_percent: 35,
            stage_message: 'Generating learning inventory',
          },
          hubBootstrapRetryStatus: 'idle',
          pageReadinessState: 'hub_bootstrapping',
          heroReady: false,
          showBootstrapBanner: true,
          hasReadyInventory: false,
          hubSyncStatus: 'idle',
          hubSyncError: null,
          slateMode: 'personalized',
          sectionReadiness: [],
          minimumReadySections: [],
          globalGenerationStage: 'assembling',
          globalProgressPercent: 35,
        },
      })
    )
    mockPersonalizationStatus.mockReturnValue({ mode: 'initializing', sectionReadiness: [] })
    mockHubData.mockReturnValue({
      usingSlate: false,
      slateMode: 'personalized',
      isProfileIncomplete: false,
      pageReadinessState: 'hub_bootstrapping',
      globalProgressPercent: 35,
      globalGenerationStage: 'assembling',
      minimumReadySections: [],
      loading: false,
      microCourses: null,
      growthRecommendations: null,
      tutorials: null,
      researchInsights: null,
      specialistTracks: null,
    })
  })

  it('renders profile completion gate when profile is incomplete', () => {
    mockHubData.mockReturnValue({
      ...mockHubData(),
      isProfileIncomplete: true,
    })

    render(<ProfessionalLearningHub />)

    expect(screen.getByText('PROFILE_COMPLETION_GATE')).toBeInTheDocument()
  })

  it('renders purple bootstrap screen when profile is complete and hub is bootstrapping', () => {
    render(<ProfessionalLearningHub />)

    expect(screen.getByText('Personalizing your learning hub')).toBeInTheDocument()
  })

  it('renders orange hub hero when hub is ready', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({
        personalization: {
          hubBootstrap: {
            show_bootstrap_banner: false,
            has_ready_inventory: true,
            can_enter_hub: true,
          },
          hubBootstrapRetryStatus: 'idle',
          pageReadinessState: 'hub_ready',
          heroReady: true,
          showBootstrapBanner: false,
          hasReadyInventory: true,
          hubSyncStatus: 'idle',
          hubSyncError: null,
          slateMode: 'personalized',
          sectionReadiness: [],
          minimumReadySections: [],
          globalGenerationStage: 'ready',
          globalProgressPercent: 100,
        },
      })
    )
    mockPersonalizationStatus.mockReturnValue({ mode: 'ready', sectionReadiness: [] })
    mockHubData.mockReturnValue({
      ...mockHubData(),
      pageReadinessState: 'hub_ready',
      globalProgressPercent: 100,
    })

    render(<ProfessionalLearningHub />)

    expect(
      screen.getByText(
        'Grow as fast as your students — with your personalized professional learning hub'
      )
    ).toBeInTheDocument()
  })
})
