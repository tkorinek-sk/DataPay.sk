(() => {
  'use strict';

  const current = (location.pathname.split('/').pop() || 'dashboard.html').toLowerCase();

  const pages = [
    { section: 'Prehľad', href: 'dashboard.html', icon: '⌂', label: 'Dashboard' },
    { section: 'Fakturácia', href: 'invoices.html', icon: '▤', label: 'Vystavené faktúry' },
    { section: 'Fakturácia', href: 'received-invoices.html', icon: '⇩', label: 'Prijaté faktúry' },
    { section: 'Fakturácia', href: 'invoice-new.html', icon: '＋', label: 'Nová faktúra' },
    { section: 'Fakturácia', href: 'contacts.html', icon: '♙', label: 'Kontakty' },
    { section: 'Nastavenia', href: 'company.html', icon: '▣', label: 'Moja firma' }
  ];

  function buildNavigation(nav) {
    const modern = nav.classList.contains('sidebar-nav');
    const sectionClass = modern ? 'nav-label' : 'label';
    const linkClass = modern ? 'nav-link' : '';
    const iconClass = modern ? 'nav-icon' : '';
    const sections = [];
    let html = '';

    for (const page of pages) {
      if (!sections.includes(page.section)) {
        sections.push(page.section);
        html += `<div class="${sectionClass}">${page.section}</div>`;
      }
      const active = current === page.href.toLowerCase() ? ' active' : '';
      html += `<a class="${linkClass}${active}" href="${page.href}">` +
              `<span class="${iconClass}">${page.icon}</span><span>${page.label}</span></a>`;
    }

    html += `<a class="${linkClass}" href="../index.html">` +
            `<span class="${iconClass}">↗</span><span>DataPay.sk</span></a>`;

    nav.innerHTML = html;
  }

  function normalizeBrand() {
    const brandName = document.querySelector('.brand-name');
    const brandSubtitle = document.querySelector('.brand-subtitle');
    if (brandName) brandName.textContent = 'MyDataPay';
    if (brandSubtitle) brandSubtitle.textContent = 'Klientsky portál';

    const compactBrand = document.querySelector('.brand');
    if (compactBrand && !brandName) {
      const strong = compactBrand.querySelector('strong');
      const small = compactBrand.querySelector('small');
      if (strong) strong.textContent = 'MyDataPay';
      if (small) small.textContent = 'Klientsky portál';
    }
  }

  function addDashboardReceivedInvoiceLinks() {
    if (current !== 'dashboard.html') return;

    document.querySelectorAll('.service-row').forEach(row => {
      const title = row.querySelector('.service-title');
      if (!title || !/prijat[eé]\s+fakt[uú]ry/i.test(title.textContent)) return;

      row.style.cursor = 'pointer';
      row.setAttribute('role', 'link');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', 'Otvoriť prijaté faktúry');

      const state = row.querySelector('.service-state');
      if (state) {
        state.textContent = 'Otvoriť';
        state.style.background = '#eef5fc';
        state.style.color = '#052c64';
      }

      const open = () => { location.href = 'received-invoices.html'; };
      row.addEventListener('click', open);
      row.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });

    document.querySelectorAll('.quick-actions').forEach(container => {
      if (container.querySelector('a[href="received-invoices.html"]')) return;
      const link = document.createElement('a');
      link.className = 'quick-action';
      link.href = 'received-invoices.html';
      link.innerHTML = '<strong>⇩ Prijaté faktúry</strong><span>Doklady a PDF archív</span>';
      container.appendChild(link);
    });
  }

  function apply() {
    const nav = document.querySelector('.sidebar-nav, .sidebar .nav');
    if (nav) buildNavigation(nav);
    normalizeBrand();
    addDashboardReceivedInvoiceLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
