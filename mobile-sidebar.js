(() => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar || document.querySelector(".mobile-menu-toggle")) return;

  const toggle = document.createElement("button");
  toggle.className = "mobile-menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Open dashboard menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = "<span></span>";

  const backdrop = document.createElement("button");
  backdrop.className = "mobile-sidebar-backdrop";
  backdrop.type = "button";
  backdrop.setAttribute("aria-label", "Close dashboard menu");

  const setOpen = (isOpen) => {
    document.body.classList.toggle("sidebar-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close dashboard menu" : "Open dashboard menu");
  };

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("sidebar-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });

  document.body.prepend(backdrop);
  document.body.prepend(toggle);
})();
