// js/auth-guard.js
// Strážca prístupu pre chránenú sekciu DataPay

(async function () {
    // Počkáme na načítanie Supabase klienta
    while (typeof supabaseClient === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
        // 1. Kontrola, či je používateľ prihlásený
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError || !session?.user) {
            location.replace('login.html');
            return;
        }

        const userId = session.user.id;

        // 2. Načítame firemný záznam pre tohto používateľa
        const { data: memberData, error: memberError } = await supabaseClient
            .from('company_members')
            .select('company_id, companies(*)')
            .eq('user_id', userId)
            .single();

        if (memberError || !memberData || !memberData.companies) {
            // Ak firma neexistuje, pošleme ho na vyplnenie firmy
            if (!location.pathname.endsWith('company.html')) {
                location.replace('company.html');
            }
            return;
        }

        const company = memberData.companies;
        const currentPage = location.pathname.split('/').pop();

        // 3. Kontrola onboardingu (či vyplnil povinné údaje o firme)
        if (!company.onboarding_completed && currentPage !== 'company.html') {
            location.replace('company.html');
            return;
        }

        // 4. Kontrola predplatného / trialu
        const now = new Date();
        const trialEnd = company.trial_ends_at ? new Date(company.trial_ends_at) : null;
        const subEnd = company.current_period_end ? new Date(company.current_period_end) : null;
        
        const hasActiveTrial = company.subscription_status === 'trialing' && trialEnd && trialEnd > now;
        const hasActiveSub = company.subscription_status === 'active' && subEnd && subEnd > now;

        // Ak nemá aktívny trial ani aktívne predplatné a nie je práve na stránke billing.html
        if (!hasActiveTrial && !hasActiveSub && currentPage !== 'billing.html') {
            location.replace('billing.html');
            return;
        }

        // Ak je všetko v poriadku, sprístupníme aplikáciu (odstránime loader, ak existuje)
        document.addEventListener('DOMContentLoaded', () => {
            const loader = document.getElementById('pageLoader');
            if (loader) loader.style.display = 'none';
            const app = document.getElementById('app');
            if (app) app.classList.add('ready');
        });

    } catch (err) {
        console.error('Auth Guard Error:', err);
        location.replace('login.html');
    }
})();
