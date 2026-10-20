/**
 * Eventos do site (GA4 pela tag do Google AW-632418375, combinada com G-Y0NXRK9QTJ).
 *
 * Um único listener delegado no document, para todas as páginas:
 *   whatsapp_click   links wa.me / api.whatsapp.com     → servico, posicao
 *   phone_click      links tel:                          → servico, posicao
 *   directions_click links de rota / Google Maps         → servico
 *   review_click     links marcados com data-ga="avaliacao" ("Ver todas no Google",
 *                    "Deixe sua avaliação" e a nota do Google)  → servico
 *
 * servico = página (front matter ga_servico; padrão "home"): home | tapete | cobertor | roupas | planos
 * posicao = hero | faq | final | flutuante | card | outro
 *
 * Sem dados pessoais: não envia URL do link, telefone, nome nem texto digitado.
 * O consentimento (Consent Mode v2) é tratado em _includes/gtag.html e _includes/consentimento.html.
 */
(function () {
    'use strict';

    // Conversões do Google Ads: preencha o label quando a conversão for criada no Google Ads.
    var AW_ID = 'AW-632418375';
    var CONVERSOES = {
        whatsapp_click: null, // ex.: 'AbCdEfGhIjKlMnOp'
        phone_click: null
    };

    var POSICOES = ['hero', 'faq', 'final', 'flutuante', 'card'];

    function servicoDaPagina() {
        return window.llServico || 'home';
    }

    function posicaoDoLink(link) {
        var marcada = (link.getAttribute('data-posicao') || '').toLowerCase();
        if (POSICOES.indexOf(marcada) > -1) return marcada;
        if (marcada.indexOf('card') > -1) return 'card';
        if (marcada) return 'outro';
        if (link.closest('.whatsapp-float')) return 'flutuante';
        if (link.closest('.hero, .svc-hero')) return 'hero';
        if (link.closest('.faq, .svc-faq, #faq, #perguntas')) return 'faq';
        if (link.closest('.cta-final')) return 'final';
        if (link.closest('.service-card, .pricing-card, .plans-resumo__item, .svc-outros__card')) return 'card';
        return 'outro';
    }

    function tipoDoLink(link) {
        var href = link.getAttribute('href') || '';
        if (link.getAttribute('data-ga') === 'avaliacao') return 'review_click';
        if (/^tel:/i.test(href)) return 'phone_click';
        if (/(^|\/\/)(wa\.me|api\.whatsapp\.com)\//i.test(href)) return 'whatsapp_click';
        if (/google\.[a-z.]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(href)) return 'directions_click';
        return null;
    }

    function enviar(nome, params) {
        if (typeof window.gtag !== 'function') return;
        params.transport_type = 'beacon';
        window.gtag('event', nome, params);
        var label = CONVERSOES[nome];
        if (label) {
            window.gtag('event', 'conversion', { send_to: AW_ID + '/' + label, transport_type: 'beacon' });
        }
    }

    document.addEventListener('click', function (ev) {
        var link = ev.target.closest && ev.target.closest('a[href]');
        if (!link) return;
        var nome = tipoDoLink(link);
        if (!nome) return;
        var params = { servico: servicoDaPagina() };
        if (nome === 'whatsapp_click' || nome === 'phone_click') params.posicao = posicaoDoLink(link);
        enviar(nome, params);
    }, true);
})();
