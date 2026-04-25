import reducer, { fetchLearningHubSlate } from './personalizationSlice'

describe('personalizationSlice gating fallback', () => {
  const getBaseState = () => reducer(undefined, { type: '@@INIT' })

  it('shows bootstrap and keeps inventory not-ready when hub_bootstrap is missing and hero is not ready', () => {
    const state = getBaseState()
    const next = reducer(
      state,
      fetchLearningHubSlate.fulfilled(
        {
          mode: 'personalized',
          sections: {},
          page_readiness_state: 'hub_bootstrapping',
          hero_ready: false,
          global_generation_stage: 'assembling',
          global_progress_percent: 42,
          orchestration: { can_enter_hub: false },
          hub_bootstrap: null,
        },
        'req-1'
      )
    )

    expect(next.showBootstrapBanner).toBe(true)
    expect(next.hasReadyInventory).toBe(false)
    expect(next.hubGateState).toBe('bootstrapping')
  })

  it('marks inventory ready when hub_bootstrap is missing and hero is ready', () => {
    const state = getBaseState()
    const next = reducer(
      state,
      fetchLearningHubSlate.fulfilled(
        {
          mode: 'personalized',
          sections: {},
          page_readiness_state: 'hub_ready',
          hero_ready: true,
          global_generation_stage: 'ready',
          global_progress_percent: 100,
          orchestration: { can_enter_hub: true },
          hub_bootstrap: null,
        },
        'req-2'
      )
    )

    expect(next.showBootstrapBanner).toBe(false)
    expect(next.hasReadyInventory).toBe(true)
    expect(next.hubGateState).toBe('hub_ready')
  })

  it('preserves authoritative hub_bootstrap flags when present', () => {
    const state = getBaseState()
    const next = reducer(
      state,
      fetchLearningHubSlate.fulfilled(
        {
          mode: 'personalized',
          sections: {},
          page_readiness_state: 'hub_bootstrapping',
          hero_ready: false,
          orchestration: { can_enter_hub: false },
          hub_bootstrap: {
            show_bootstrap_banner: true,
            has_ready_inventory: false,
            can_enter_hub: false,
          },
        },
        'req-3'
      )
    )

    expect(next.showBootstrapBanner).toBe(true)
    expect(next.hasReadyInventory).toBe(false)
    expect(next.hubBootstrap?.can_enter_hub).toBe(false)
    expect(next.hubGateState).toBe('bootstrapping')
  })
})
