function GuidedMode({
  guidedSteps,
  active,
  currentIndex,
  onStart,
  onNext,
  onPrevious,
  onExit,
}) {
  const currentStep = guidedSteps[currentIndex];

  if (!active) {
    return (
      <section className="guided-mode">
        <div>
          <p className="guided-kicker">Guided mode</p>
          <h2>Walk the wheel step by step.</h2>
          <p>
            Begin at the center, move outward through karma and the realms, then see the causal
            chain and the path beyond it.
          </p>
        </div>
        <button type="button" className="primary-button" onClick={onStart}>
          Start here
        </button>
      </section>
    );
  }

  return (
    <section className="guided-mode guided-mode-active" aria-live="polite">
      <div>
        <p className="guided-kicker">
          Step {currentIndex + 1} of {guidedSteps.length}
        </p>
        <h2>{currentStep.title}</h2>
        <p>{currentStep.description}</p>
      </div>
      <div className="guided-actions">
        <button type="button" className="ghost-button" onClick={onPrevious} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={currentIndex === guidedSteps.length - 1 ? onExit : onNext}
        >
          {currentIndex === guidedSteps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}

export default GuidedMode;
