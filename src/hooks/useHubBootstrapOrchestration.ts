// @ts-nocheck
/**
 * Polls GET /learning-hub/home while the hub is not enterable (orchestration lives in hub_bootstrap on that payload).
 * When SSE is available and connected, the polling interval is skipped — SSE is the primary transport.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLearningHubSlate,
  PERSONALIZATION_ENABLED,
  selectHubBootstrap,
} from '../redux/features/personalization/personalizationSlice';
import { useHubBootstrapSSE } from './useHubBootstrapSSE';

const POLL_MS = 3000;

export function useHubBootstrapOrchestration(showColdStart: boolean) {
  const dispatch = useDispatch();
  const hubBootstrap = useSelector(selectHubBootstrap);
  const gateState = useSelector((s) => s.personalization?.hubGateState ?? 'bootstrapping');
  const sectionReadiness = useSelector((s) => s.personalization?.hubSectionReadiness ?? {});
  const canEnterHub = hubBootstrap?.can_enter_hub === true;
  const requiredSections = Array.isArray(hubBootstrap?.required_sections)
    ? hubBootstrap.required_sections
    : Object.keys(sectionReadiness || {});
  const hasSectionWorkRemaining = (requiredSections || []).some((sectionKey) => {
    const sec = sectionReadiness?.[sectionKey] || {};
    return (
      sec.is_preparing_more === true ||
      sec.is_generating === true ||
      sec.is_fully_ready === false
    );
  });
  const generationInflight = hubBootstrap?.generation_inflight === true;
  const postEntryRefreshNeeded = canEnterHub && (generationInflight || hasSectionWorkRemaining);
  const shouldKeepBootstrapTransport =
    (gateState === 'bootstrapping' && !canEnterHub) || postEntryRefreshNeeded;

  // SSE is the primary transport while bootstrapping is in progress.
  const sseEnabled =
    PERSONALIZATION_ENABLED && !showColdStart && shouldKeepBootstrapTransport;
  const { connected: sseConnected, fallbackPolling: sseFallbackPolling } = useHubBootstrapSSE(sseEnabled);

  // Polling interval is the fallback: only runs when SSE is not connected.
  useEffect(() => {
    if (!PERSONALIZATION_ENABLED || showColdStart || !shouldKeepBootstrapTransport) return;
    // SSE is live — skip polling to avoid redundant fetches.
    if (sseConnected || sseFallbackPolling) return;
    const id = window.setInterval(() => {
      dispatch(fetchLearningHubSlate());
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [dispatch, showColdStart, canEnterHub, sseConnected, sseFallbackPolling, shouldKeepBootstrapTransport]);

  useEffect(() => {
    if (hubBootstrap?.can_enter_hub && !postEntryRefreshNeeded) {
      dispatch(fetchLearningHubSlate());
    }
  }, [dispatch, hubBootstrap?.can_enter_hub, postEntryRefreshNeeded]);

  const bootstrapPollingActive =
    sseEnabled && (sseConnected || sseFallbackPolling || shouldKeepBootstrapTransport);
  return { bootstrapPollingActive };
}
