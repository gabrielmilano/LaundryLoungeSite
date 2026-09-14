/**
 * Tracking — Google Ads (AW-632418375)
 *
 * Este arquivo expõe funções utilitárias para enviar eventos de conversão
 * ao Google Ads. Ele também registra listeners automáticos para:
 *   - Cliques em links WhatsApp (evento "whatsapp_click")
 *   - Envio de formulário de contato (evento "form_submit")
 *
 * Para ativar uma conversão, substitua o placeholder pelo Conversion Label
 * correspondente no Google Ads.
 *
 * Uso futuro (chamadas manuais):
 *   GoogleAdsTracking.lead();
 *   GoogleAdsTracking.whatsappClick();
 *   GoogleAdsTracking.formSubmit();
 *   GoogleAdsTracking.custom('event_name', { send_to: 'AW-632418375/CONVERSION_LABEL' });
 */

const GoogleAdsTracking = (() => {
    const AW_ID = 'AW-632418375';

    // ── Conversion Labels (placeholder) ──────────────────────────────
    // Substitua pelos labels reais criados no Google Ads.
    const CONVERSIONS = {
        lead:             null, // Ex: 'AbCdEfGhIjKlMnOp'
        whatsapp_click:   null,
        form_submit:      null,
        compra:           null,
        agendamento:      null,
    };

    // ── Helpers ──────────────────────────────────────────────────────
    function send(eventName, params = {}) {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, params);
    }

    function conversion(key, extra = {}) {
        const label = CONVERSIONS[key];
        if (!label) {
            console.warn(`[Tracking] Conversion "${key}" não configurada. Adicione o Conversion Label.`);
            return;
        }
        send('conversion', {
            send_to: `${AW_ID}/${label}`,
            ...extra,
        });
    }

    // ── Públicos ─────────────────────────────────────────────────────
    return {
        /** Dispara conversão de Lead genérico. */
        lead(extra) {
            conversion('lead', extra);
        },

        /** Dispara conversão de clique no WhatsApp. */
        whatsappClick(extra) {
            conversion('whatsapp_click', extra);
            send('whatsapp_click', extra);
        },

        /** Dispara conversão de formulário enviado. */
        formSubmit(extra) {
            conversion('form_submit', extra);
            send('form_submit', extra);
        },

        /** Dispara conversão de compra. */
        compra(extra) {
            conversion('compra', extra);
        },

        /** Dispara conversão de agendamento. */
        agendamento(extra) {
            conversion('agendamento', extra);
        },

        /**
         * Envia um evento customizado.
         * @param {string} eventName
         * @param {object} params - Deve incluir `send_to` se for conversão.
         */
        custom(eventName, params) {
            send(eventName, params);
        },
    };
})();

// ── Listeners automáticos ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // WhatsApp clicks (qualquer link wa.me)
    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
        link.addEventListener('click', () => {
            GoogleAdsTracking.whatsappClick({
                link_url: link.href,
            });
        });
    });

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            GoogleAdsTracking.formSubmit();
        });
    }
});
