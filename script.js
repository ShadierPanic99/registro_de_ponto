class JogoDaVelha {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.score = {
            x: 0,
            o: 0,
            draw: 0
        };
        
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('reset-btn');
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        this.scoreDraw = document.getElementById('score-draw');
        
        this.cells.forEach(cell => {
            cell.addEventListener('click', this.handleCellClick.bind(this));
        });
        
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        
        this.updateStatus();
        this.updateScore();
    }
    
    handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index, cell);
    }
    
    makeMove(index, cell) {
        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWinner()) {
            this.gameActive = false;
            this.highlightWinningCells();
            this.statusElement.textContent = `Jogador ${this.currentPlayer} venceu!`;
            this.score[this.currentPlayer.toLowerCase()]++;
            this.updateScore();
            this.celebrateWin();
        } else if (this.checkDraw()) {
            this.gameActive = false;
            this.statusElement.textContent = 'Empate!';
            this.score.draw++;
            this.updateScore();
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }
    
    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells() {
        this.winningConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.cells[a].classList.add('winner');
                this.cells[b].classList.add('winner');
                this.cells[c].classList.add('winner');
            }
        });
    }
    
    celebrateWin() {
        // Adiciona um pequeno efeito de celebração
        setTimeout(() => {
            const winnerCells = document.querySelectorAll('.winner');
            winnerCells.forEach(cell => {
                cell.style.animation = 'winner-pulse 0.6s ease-in-out infinite';
            });
        }, 100);
    }
    
    updateStatus() {
        if (this.gameActive) {
            this.statusElement.textContent = `Vez do jogador ${this.currentPlayer}`;
        }
    }
    
    updateScore() {
        this.scoreX.textContent = this.score.x;
        this.scoreO.textContent = this.score.o;
        this.scoreDraw.textContent = this.score.draw;
    }
    
    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.animation = '';
        });
        
        this.updateStatus();
    }
    
    resetScore() {
        this.score = { x: 0, o: 0, draw: 0 };
        this.updateScore();
    }
}

// Funcionalidades extras
document.addEventListener('DOMContentLoaded', function() {
    const game = new JogoDaVelha();
    
    // Adiciona funcionalidade de reset do placar com duplo clique
    const scoreContainer = document.querySelector('.score');
    scoreContainer.addEventListener('dblclick', function() {
        if (confirm('Deseja zerar o placar?')) {
            game.resetScore();
        }
    });
    
    // Adiciona efeitos sonoros simples usando Web Audio API
    const playSound = (frequency, duration) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Navegador não suporta Web Audio API
        }
    };
    
    // Adiciona sons aos cliques
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.textContent === '') {
                playSound(800, 0.1);
            }
        });
    });
    
    // Som de vitória
    const originalMakeMove = game.makeMove.bind(game);
    game.makeMove = function(index, cell) {
        originalMakeMove(index, cell);
        if (!this.gameActive && this.checkWinner()) {
            setTimeout(() => playSound(1200, 0.3), 100);
        }
    };
});

// Adiciona suporte a teclado
document.addEventListener('keydown', function(event) {
    const keyMap = {
        '1': 0, '2': 1, '3': 2,
        '4': 3, '5': 4, '6': 5,
        '7': 6, '8': 7, '9': 8
    };
    
    const index = keyMap[event.key];
    if (index !== undefined) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.click();
        }
    }
    
    if (event.key === 'r' || event.key === 'R') {
        document.getElementById('reset-btn').click();
    }
});
