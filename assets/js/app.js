/**
 * PILOTINE - Main Application JavaScript
 * Handles common functionality across all pages
 */

(function() {
    'use strict';

    // ===== Login Page Logic =====
    const loginForm = document.getElementById('loginForm');
    const mfaSection = document.getElementById('mfaSection');
    const mfaForm = document.getElementById('mfaForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate login validation
            if (email && password) {
                // Hide login form and show MFA section
                loginForm.classList.add('uk-hidden');
                mfaSection.classList.remove('uk-hidden');
                
                // Focus on MFA input
                document.getElementById('mfaCode').focus();
                
                // Show notification
                UIkit.notification({
                    message: 'Code de vérification envoyé',
                    status: 'primary',
                    pos: 'top-right',
                    timeout: 3000
                });
            }
        });
    }

    if (mfaForm) {
        mfaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const mfaCode = document.getElementById('mfaCode').value;
            
            // Simulate MFA validation (accept any 6-digit code for demo)
            if (mfaCode && mfaCode.length === 6) {
                UIkit.notification({
                    message: 'Authentification réussie! Redirection...',
                    status: 'success',
                    pos: 'top-right',
                    timeout: 2000
                });
                
                // Redirect to dashboard after brief delay
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                UIkit.notification({
                    message: 'Code invalide. Veuillez réessayer.',
                    status: 'danger',
                    pos: 'top-right',
                    timeout: 3000
                });
            }
        });
    }

    // ===== Format Currency =====
    window.formatCurrency = function(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // ===== Format Percentage =====
    window.formatPercent = function(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    // ===== Export Button =====
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            UIkit.notification({
                message: 'Génération du PDF en cours...',
                status: 'primary',
                pos: 'top-right',
                timeout: 2000
            });
            
            // Simulate PDF generation
            setTimeout(function() {
                UIkit.notification({
                    message: 'PDF généré avec succès!',
                    status: 'success',
                    pos: 'top-right',
                    timeout: 3000
                });
            }, 2000);
        });
    }

    // ===== Theme Toggle (optional) =====
    window.toggleTheme = function() {
        document.documentElement.classList.toggle('dark');
    };

    // ===== Number Animation =====
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = formatCurrency(value);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ===== Initialize Tooltips =====
    document.querySelectorAll('[title]').forEach(function(el) {
        el.setAttribute('uk-tooltip', '');
    });

    // ===== Search Functionality =====
    const searchInput = document.querySelector('.uk-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(function(row) {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // ===== Page Load Animation =====
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.opacity = '0';
        setTimeout(function() {
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===== Console Branding =====
    console.log('%cPILOTINE', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
    console.log('%cPilotage de la Masse Salariale', 'font-size: 12px; color: #94a3b8;');
    console.log('%cConnexion sécurisée MY SILAE', 'font-size: 10px; color: #22c55e;');

})();
