/**
 * Gameboard Module (IIFE - Module Pattern)
 * Χειρίζεται την κατάσταση του ταμπλό.
 */
const Gameboard = (() => {
  // Το ταμπλό είναι ένας πίνακας 9 στοιχείων, αρχικά κενός ('')
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMark = (index, mark) => {
    // Ελέγχει αν το index είναι έγκυρο και η θέση είναι κενή
    if (index >= 0 && index < 9 && board[index] === "") {
      board[index] = mark;
      return true; // Επιτυχής τοποθέτηση
    }
    return false; // Αποτυχημένη τοποθέτηση
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    placeMark,
    reset,
  };
})();

/**
 * Player Factory Function
 * Δημιουργεί αντικείμενα παίκτη.
 */
const Player = (name, mark) => {
  return { name, mark };
};
/**
 * GameController Module (IIFE - Module Pattern)
 * Χειρίζεται τη ροή, τη σειρά, και τον έλεγχο νίκης/ισοπαλίας.
 */
const GameController = (() => {
  const playerX = Player("Παίκτης 1", "X");
  const playerO = Player("Παίκτης 2", "O");
  let activePlayer = playerX;
  let isGameOver = false;

  const getActivePlayer = () => activePlayer;
  const getGameOverStatus = () => isGameOver;

  const switchPlayer = () => {
    activePlayer = activePlayer === playerX ? playerO : playerX;
  };

  // Όλοι οι πιθανοί συνδυασμοί νίκης (indices του ταμπλό)
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Οριζόντιες
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Κάθετες
    [0, 4, 8],
    [2, 4, 6], // Διαγώνιες
  ];

  const checkWin = (board) => {
    return winningCombinations.some((combination) => {
      // Ελέγχει αν και οι 3 θέσεις έχουν το ίδιο ΜΗ ΚΕΝΟ σύμβολο
      return combination.every((index) => board[index] === activePlayer.mark);
    });
  };

  const checkTie = (board) => {
    // Ελέγχει αν όλες οι θέσεις είναι γεμάτες (δεν υπάρχει κενό "")
    return board.every((cell) => cell !== "");
  };

  const playRound = (index) => {
    if (isGameOver) return; // Αγνόησε αν το παιχνίδι έχει τελειώσει

    const markPlaced = Gameboard.placeMark(index, activePlayer.mark);

    if (markPlaced) {
      const currentBoard = Gameboard.getBoard();

      if (checkWin(currentBoard)) {
        console.log(`${activePlayer.name} (${activePlayer.mark}) κερδίζει!`);
        isGameOver = true;
        return;
      }

      if (checkTie(currentBoard)) {
        console.log("Ισοπαλία!");
        isGameOver = true;
        return;
      }

      // Εναλλαγή παίκτη μόνο αν έγινε επιτυχής τοποθέτηση
      switchPlayer();
      console.log(`Σειρά του: ${activePlayer.name} (${activePlayer.mark})`);
    } else {
      console.log(
        "Μη έγκυρη κίνηση. Η θέση είναι ήδη κατειλημμένη ή το index είναι λάθος."
      );
    }
  };

  const startGame = () => {
    Gameboard.reset();
    activePlayer = playerX; // Ξεκινάει πάντα ο X
    isGameOver = false;
    console.log("Το παιχνίδι ξεκίνησε! Σειρά του: Παίκτης 1 (X)");
  };

  return {
    startGame,
    playRound,
    getActivePlayer,
    getGameOverStatus,
  };
})();

/**
 * DisplayController Module (IIFE - Module Pattern)
 * Χειρίζεται τη δόμηση DOM, την εμφάνιση του ταμπλό και τις αλληλεπιδράσεις.
 */
const DisplayController = (() => {
  const boardDiv = document.querySelector(".board");
  const messageDiv = document.querySelector(".message");
  const restartButton = document.querySelector("#restart");

  const renderBoard = () => {
    // Καθαρίζει το υπάρχον ταμπλό
    boardDiv.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.index = index; // Αποθηκεύει το index
      cellDiv.textContent = cell;
      boardDiv.appendChild(cellDiv);
    });
  };

  const updateMessage = (message) => {
    messageDiv.textContent = message;
  };

  // Συναρτήσεις χειρισμού συμβάντων (Event Handlers)
  const clickHandlerBoard = (e) => {
    if (
      e.target.classList.contains("cell") &&
      !GameController.getGameOverStatus()
    ) {
      const index = parseInt(e.target.dataset.index);
      GameController.playRound(index);
      updateDisplay(); // Ενημερώνει το ταμπλό και το μήνυμα
    }
  };

  const updateDisplay = () => {
    renderBoard();
    const activePlayer = GameController.getActivePlayer();
    let message = `Σειρά του: ${activePlayer.name} (${activePlayer.mark})`;

    // Πρέπει να λάβουμε το τελικό αποτέλεσμα από τον GameController
    // (θα έπρεπε να τροποποιήσουμε το GameController για να επιστρέφει την κατάσταση)
    // Προς το παρόν, απλώς ελέγχουμε την κατάσταση του παιχνιδιού
    if (GameController.getGameOverStatus()) {
      message = "Το παιχνίδι τελείωσε. Ελέγξτε την κονσόλα για το αποτέλεσμα.";
      // ΣΕ ΠΡΑΓΜΑΤΙΚΟ ΣΕΝΑΡΙΟ: θα ενημερώναμε το μήνυμα με τον νικητή/ισοπαλία
    }

    updateMessage(message);
  };

  const setupEventListeners = () => {
    boardDiv.addEventListener("click", clickHandlerBoard);
    restartButton.addEventListener("click", () => {
      GameController.startGame();
      updateDisplay();
    });

    // Δείγμα για την εκκίνηση
    GameController.startGame();
    updateDisplay();
  };

  return {
    setupEventListeners,
    updateDisplay,
    renderBoard, // Χρήσιμο για αρχική εμφάνιση
  };
})();
// Καλεί τη ρύθμιση για να ξεκινήσει ο ακροατής συμβάντων μόλις φορτώσει το DOM
// DisplayController.setupEventListeners();

// ... (Όλα τα Gameboard, Player, GameController, DisplayController modules) ...

// Εκκίνηση του παιχνιδιού και ρύθμιση ακροατών συμβάντων
document.addEventListener("DOMContentLoaded", () => {
  DisplayController.setupEventListeners();
});
