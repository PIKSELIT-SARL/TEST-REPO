/**
 * PILOTINE - Simulation Module JavaScript
 * Handles simulation form interactions and calculations
 */

(function() {
    'use strict';

    // ===== Employee Data (Mock) =====
    const employees = {
        '1': {
            id: 1,
            name: 'Marie Dupont',
            initials: 'MD',
            department: 'Production',
            contract: 'CDI',
            etp: 1.0,
            salary: 3200,
            totalCost: 4480,
            startDate: '2019-03-15'
        },
        '2': {
            id: 2,
            name: 'Jean Martin',
            initials: 'JM',
            department: 'Commercial',
            contract: 'CDI',
            etp: 1.0,
            salary: 4500,
            totalCost: 6300,
            startDate: '2021-01-10'
        },
        '3': {
            id: 3,
            name: 'Sophie Leroy',
            initials: 'SL',
            department: 'Administration',
            contract: 'CDD',
            etp: 0.8,
            salary: 2400,
            totalCost: 3360,
            startDate: '2023-06-01'
        },
        '4': {
            id: 4,
            name: 'Pierre Bernard',
            initials: 'PB',
            department: 'R&D',
            contract: 'CDI',
            etp: 1.0,
            salary: 5200,
            totalCost: 7280,
            startDate: '2018-09-01'
        }
    };

    // ===== DOM Elements =====
    const employeeSelect = document.getElementById('employeeSelect');
    const employeeInfo = document.getElementById('employeeInfo');
    const actionRadios = document.querySelectorAll('input[name="actionType"]');
    
    const salaryForm = document.getElementById('salaryForm');
    const exitForm = document.getElementById('exitForm');
    const replaceForm = document.getElementById('replaceForm');
    const etpForm = document.getElementById('etpForm');
    
    const resetBtn = document.getElementById('resetBtn');
    const addToScenarioBtn = document.getElementById('addToScenarioBtn');

    // ===== Current State =====
    let currentEmployee = employees['1'];
    let currentAction = 'salary';

    // ===== Initialize =====
    function init() {
        if (!employeeSelect) return;
        
        // Set initial employee from URL if provided
        const urlParams = new URLSearchParams(window.location.search);
        const employeeId = urlParams.get('employee');
        if (employeeId && employees[employeeId]) {
            employeeSelect.value = employeeId;
            currentEmployee = employees[employeeId];
            updateEmployeeInfo();
        }

        // Bind events
        employeeSelect.addEventListener('change', handleEmployeeChange);
        actionRadios.forEach(radio => {
            radio.addEventListener('change', handleActionChange);
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', handleReset);
        }

        if (addToScenarioBtn) {
            addToScenarioBtn.addEventListener('click', handleAddToScenario);
        }

        // Bind form inputs for live calculation
        bindCalculationInputs();
    }

    // ===== Handle Employee Change =====
    function handleEmployeeChange(e) {
        const employeeId = e.target.value;
        
        if (employeeId === 'new') {
            // Show new employee form (simplified for MVP)
            UIkit.notification({
                message: 'Fonctionnalité "Nouveau Collaborateur" à venir',
                status: 'primary',
                pos: 'top-right',
                timeout: 3000
            });
            employeeSelect.value = currentEmployee.id;
            return;
        }

        if (employeeId && employees[employeeId]) {
            currentEmployee = employees[employeeId];
            updateEmployeeInfo();
            updateCalculations();
        }
    }

    // ===== Update Employee Info Panel =====
    function updateEmployeeInfo() {
        if (!employeeInfo || !currentEmployee) return;

        employeeInfo.innerHTML = `
            <div class="uk-flex uk-flex-middle uk-margin-bottom">
                <div class="uk-border-circle uk-background-primary uk-flex uk-flex-center uk-flex-middle" 
                     style="width: 50px; height: 50px;">
                    <span class="uk-text-bold" style="color: white;">${currentEmployee.initials}</span>
                </div>
                <div class="uk-margin-small-left">
                    <p class="uk-margin-remove uk-text-bold">${currentEmployee.name}</p>
                    <p class="uk-margin-remove uk-text-small uk-text-muted">${currentEmployee.department}</p>
                </div>
            </div>
            <ul class="uk-list uk-list-divider uk-margin-remove">
                <li class="uk-flex uk-flex-between">
                    <span class="uk-text-muted">Contrat</span>
                    <span>${currentEmployee.contract}</span>
                </li>
                <li class="uk-flex uk-flex-between">
                    <span class="uk-text-muted">ETP Actuel</span>
                    <span>${currentEmployee.etp}</span>
                </li>
                <li class="uk-flex uk-flex-between">
                    <span class="uk-text-muted">Salaire Brut</span>
                    <span>${formatCurrency(currentEmployee.salary)}</span>
                </li>
                <li class="uk-flex uk-flex-between">
                    <span class="uk-text-muted">Coût Total</span>
                    <span class="uk-text-bold">${formatCurrency(currentEmployee.totalCost)}</span>
                </li>
            </ul>
        `;

        // Update ETP form values
        const currentEtpInput = document.getElementById('currentEtp');
        if (currentEtpInput) {
            currentEtpInput.value = currentEmployee.etp;
        }
    }

    // ===== Handle Action Type Change =====
    function handleActionChange(e) {
        currentAction = e.target.value;
        
        // Hide all forms
        [salaryForm, exitForm, replaceForm, etpForm].forEach(form => {
            if (form) form.classList.add('uk-hidden');
        });

        // Show selected form
        switch(currentAction) {
            case 'salary':
                if (salaryForm) salaryForm.classList.remove('uk-hidden');
                break;
            case 'exit':
                if (exitForm) exitForm.classList.remove('uk-hidden');
                break;
            case 'replace':
                if (replaceForm) replaceForm.classList.remove('uk-hidden');
                break;
            case 'etp':
                if (etpForm) etpForm.classList.remove('uk-hidden');
                break;
        }

        updateCalculations();
    }

    // ===== Bind Calculation Inputs =====
    function bindCalculationInputs() {
        // Salary adjustment inputs
        const adjustmentValue = document.getElementById('adjustmentValue');
        const adjustmentMethod = document.getElementById('adjustmentMethod');
        const adjustmentUnit = document.getElementById('adjustmentUnit');

        if (adjustmentMethod) {
            adjustmentMethod.addEventListener('change', function() {
                if (adjustmentUnit) {
                    adjustmentUnit.textContent = this.value === 'percent' ? '%' : '€';
                }
                updateCalculations();
            });
        }

        if (adjustmentValue) {
            adjustmentValue.addEventListener('input', updateCalculations);
        }

        // ETP slider
        const etpRange = document.getElementById('etpRange');
        const newEtp = document.getElementById('newEtp');

        if (etpRange && newEtp) {
            etpRange.addEventListener('input', function() {
                newEtp.value = this.value;
                updateCalculations();
            });

            newEtp.addEventListener('input', function() {
                etpRange.value = this.value;
                updateCalculations();
            });
        }

        // Other form inputs
        document.querySelectorAll('.simulation-form input, .simulation-form select').forEach(input => {
            input.addEventListener('change', updateCalculations);
        });
    }

    // ===== Update Calculations =====
    function updateCalculations() {
        switch(currentAction) {
            case 'salary':
                updateSalaryCalculation();
                break;
            case 'exit':
                updateExitCalculation();
                break;
            case 'replace':
                updateReplaceCalculation();
                break;
            case 'etp':
                updateEtpCalculation();
                break;
        }
    }

    // ===== Salary Calculation =====
    function updateSalaryCalculation() {
        const methodEl = document.getElementById('adjustmentMethod');
        const valueEl = document.getElementById('adjustmentValue');
        
        if (!methodEl || !valueEl || !currentEmployee) return;

        const method = methodEl.value;
        const value = parseFloat(valueEl.value) || 0;
        const currentSalary = currentEmployee.salary;
        
        let adjustment, newSalary;
        
        if (method === 'percent') {
            adjustment = currentSalary * (value / 100);
            newSalary = currentSalary + adjustment;
        } else {
            adjustment = value;
            newSalary = currentSalary + adjustment;
        }

        // Update preview
        const preview = salaryForm.querySelector('.calculation-preview');
        if (preview) {
            preview.innerHTML = `
                <h4 class="uk-margin-small-bottom">Aperçu du calcul</h4>
                <div class="uk-grid-small uk-child-width-1-3@s" uk-grid>
                    <div>
                        <div class="uk-text-small uk-text-muted">Salaire Actuel</div>
                        <div class="uk-text-lead">${formatCurrency(currentSalary)}</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Ajustement</div>
                        <div class="uk-text-lead ${adjustment >= 0 ? 'uk-text-success' : 'uk-text-danger'}">
                            ${adjustment >= 0 ? '+' : ''}${formatCurrency(adjustment)}
                        </div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Nouveau Salaire</div>
                        <div class="uk-text-lead uk-text-primary">${formatCurrency(newSalary)}</div>
                    </div>
                </div>
            `;
        }
    }

    // ===== Exit Calculation =====
    function updateExitCalculation() {
        const noticePeriodEl = document.getElementById('noticePeriod');
        const severancePayEl = document.getElementById('severancePay');
        
        if (!noticePeriodEl || !severancePayEl || !currentEmployee) return;

        const noticePeriod = parseInt(noticePeriodEl.value) || 0;
        const severancePay = parseFloat(severancePayEl.value) || 0;
        
        const noticeCost = currentEmployee.totalCost * noticePeriod;
        const annualSavings = currentEmployee.totalCost * 12;

        const preview = exitForm.querySelector('.calculation-preview');
        if (preview) {
            preview.innerHTML = `
                <h4 class="uk-margin-small-bottom">Impact Financier</h4>
                <div class="uk-grid-small uk-child-width-1-3@s" uk-grid>
                    <div>
                        <div class="uk-text-small uk-text-muted">Coût Préavis</div>
                        <div class="uk-text-lead">${formatCurrency(noticeCost)}</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Indemnités</div>
                        <div class="uk-text-lead">${formatCurrency(severancePay)}</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Économie Annuelle</div>
                        <div class="uk-text-lead uk-text-success">-${formatCurrency(annualSavings)}</div>
                    </div>
                </div>
            `;
        }
    }

    // ===== Replace Calculation =====
    function updateReplaceCalculation() {
        const newSalaryEl = document.getElementById('newSalary');
        const recruitmentCostEl = document.getElementById('recruitmentCost');
        
        if (!newSalaryEl || !recruitmentCostEl || !currentEmployee) return;

        const newSalary = parseFloat(newSalaryEl.value) || 0;
        const recruitmentCost = parseFloat(recruitmentCostEl.value) || 0;
        
        const currentAnnualCost = currentEmployee.totalCost * 12;
        const newAnnualCost = (newSalary * 1.4) * 12; // Assuming 40% charges
        const variance = newAnnualCost - currentAnnualCost + recruitmentCost;

        const preview = replaceForm.querySelector('.calculation-preview');
        if (preview) {
            preview.innerHTML = `
                <h4 class="uk-margin-small-bottom">Comparaison des Coûts</h4>
                <div class="uk-grid-small uk-child-width-1-3@s" uk-grid>
                    <div>
                        <div class="uk-text-small uk-text-muted">Coût Sortant</div>
                        <div class="uk-text-lead">${formatCurrency(currentAnnualCost)}/an</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Coût Entrant</div>
                        <div class="uk-text-lead">${formatCurrency(newAnnualCost)}/an</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Variance</div>
                        <div class="uk-text-lead ${variance <= 0 ? 'uk-text-success' : 'uk-text-danger'}">
                            ${variance <= 0 ? '' : '+'}${formatCurrency(variance)}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // ===== ETP Calculation =====
    function updateEtpCalculation() {
        const newEtpEl = document.getElementById('newEtp');
        
        if (!newEtpEl || !currentEmployee) return;

        const newEtp = parseFloat(newEtpEl.value) || 0;
        const currentEtp = currentEmployee.etp;
        
        const currentMonthlyCost = currentEmployee.totalCost;
        const newMonthlyCost = (currentEmployee.totalCost / currentEtp) * newEtp;
        const annualSavings = (currentMonthlyCost - newMonthlyCost) * 12;

        const preview = etpForm.querySelector('.calculation-preview');
        if (preview) {
            preview.innerHTML = `
                <h4 class="uk-margin-small-bottom">Impact sur le Coût</h4>
                <div class="uk-grid-small uk-child-width-1-3@s" uk-grid>
                    <div>
                        <div class="uk-text-small uk-text-muted">Coût Actuel</div>
                        <div class="uk-text-lead">${formatCurrency(currentMonthlyCost)}/mois</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Nouveau Coût</div>
                        <div class="uk-text-lead">${formatCurrency(newMonthlyCost)}/mois</div>
                    </div>
                    <div>
                        <div class="uk-text-small uk-text-muted">Économie Annuelle</div>
                        <div class="uk-text-lead ${annualSavings >= 0 ? 'uk-text-success' : 'uk-text-danger'}">
                            ${annualSavings >= 0 ? '-' : '+'}${formatCurrency(Math.abs(annualSavings))}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // ===== Handle Reset =====
    function handleReset() {
        // Reset all form inputs to default values
        document.querySelectorAll('.simulation-form input').forEach(input => {
            if (input.type === 'number') {
                input.value = input.defaultValue || '';
            }
        });
        
        document.querySelectorAll('.simulation-form select').forEach(select => {
            select.selectedIndex = 0;
        });

        updateCalculations();

        UIkit.notification({
            message: 'Formulaire réinitialisé',
            status: 'primary',
            pos: 'top-right',
            timeout: 2000
        });
    }

    // ===== Handle Add to Scenario =====
    function handleAddToScenario() {
        UIkit.notification({
            message: `Action ajoutée au scénario pour ${currentEmployee.name}`,
            status: 'success',
            pos: 'top-right',
            timeout: 3000
        });
    }

    // ===== Format Currency Helper =====
    function formatCurrency(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    }

    // ===== Initialize on DOM Ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
