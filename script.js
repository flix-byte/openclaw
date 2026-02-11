class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.scientificMode = false;
        this.memory = 0;
        
        this.currentDisplay = document.getElementById('current');
        this.previousDisplay = document.getElementById('previous');
        
        this.init();
    }
    
    init() {
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.appendNumber(btn.dataset.number);
                this.animateButton(btn);
            });
        });
        
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('sci')) {
                    this.handleScientific(btn.dataset.action);
                } else {
                    this.handleAction(btn.dataset.action);
                }
                this.animateButton(btn);
            });
        });
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleMode(btn);
            });
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    animateButton(btn) {
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 300);
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }
    
    handleAction(action) {
        switch(action) {
            case 'clear': this.clear(); break;
            case 'delete': this.delete(); break;
            case 'percent': this.percent(); break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
            case 'equals':
                this.compute();
                break;
        }
    }
    
    handleScientific(action) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch(action) {
            case 'sin': result = Math.sin(this.toRadians(current)); break;
            case 'cos': result = Math.cos(this.toRadians(current)); break;
            case 'tan': result = Math.tan(this.toRadians(current)); break;
            case 'sqrt': result = Math.sqrt(current); break;
            case 'log': result = Math.log10(current); break;
            case 'ln': result = Math.log(current); break;
            case 'pow': this.chooseOperation('pow'); return;
            case 'pi': result = Math.PI; break;
            case 'e': result = Math.E; break;
            case 'factorial': result = this.factorial(current); break;
            case 'abs': result = Math.abs(current); break;
            case 'inv': result = 1 / current; break;
        }
        
        this.currentOperand = this.formatNumber(result);
        this.updateDisplay();
    }
    
    toRadians(degrees) { return degrees * (Math.PI / 180); }
    
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(this.operation) {
            case 'add': computation = prev + current; break;
            case 'subtract': computation = prev - current; break;
            case 'multiply': computation = prev * current; break;
            case 'divide':
                if (current === 0) { alert('Cannot divide by zero!'); return; }
                computation = prev / current;
                break;
            case 'pow': computation = Math.pow(prev, current); break;
            default: return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }
    
    formatNumber(number) {
        if (isNaN(number)) return 'Error';
        if (!isFinite(number)) return 'Error';
        if (Math.abs(number) > 999999999999) return number.toExponential(6);
        return Math.round(number * 1000000000) / 1000000000;
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }
    
    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = this.formatNumber(current / 100);
        this.updateDisplay();
    }
    
    toggleMode(btn) {
        this.scientificMode = !this.scientificMode;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const sciButtons = document.querySelector('.scientific-buttons');
        if (this.scientificMode) {
            sciButtons.classList.add('show');
        } else {
            sciButtons.classList.remove('show');
        }
    }
    
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') this.compute();
        if (e.key === 'Backspace') this.delete();
        if (e.key === 'Escape') this.clear();
        if (e.key === '+') this.chooseOperation('add');
        if (e.key === '-') this.chooseOperation('subtract');
        if (e.key === '*') this.chooseOperation('multiply');
        if (e.key === '/') this.chooseOperation('divide');
    }
    
    updateDisplay() {
        this.currentDisplay.textContent = this.currentOperand;
        if (this.operation != null) {
            const opSymbol = this.getOperationSymbol(this.operation);
            this.previousDisplay.textContent = `${this.previousOperand} ${opSymbol}`;
        } else {
            this.previousDisplay.textContent = '';
        }
    }
    
    getOperationSymbol(operation) {
        const symbols = {
            'add': '+', 'subtract': '-', 'multiply': '×', 'divide': '÷', 'pow': '^'
        };
        return symbols[operation] || operation;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
    console.log('🦾 Pro Calculator initialized');
});
