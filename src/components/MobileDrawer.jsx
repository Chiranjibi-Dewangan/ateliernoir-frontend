function MobileDrawer({ children }) {
  return (
    <section className="mobile-drawer" aria-label="Selected section details">
      <div className="mobile-drawer-handle" aria-hidden="true" />
      {children}
    </section>
  );
}

export default MobileDrawer;
