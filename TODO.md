# Bugs

- Limit the maximum height for command textarea
- In CSS: .modal .body .buttons elements are having different size (they all are flex-grow: 1, which works, but with a bit different size for each element)
- Modal window width is not growing to 100% - 20px of screen width, when there is a long text in one row in modal body
- In modal window input boxes are not growing to 100 of TD element (for example in quick-add-modal.html - class="grow")

# Features

- Add, edit and delete quick commands
- Switch the order of quick commands buttons
- Add a possibility to move modal window (drag by title bar)
- Add WebTransport support (switch WebSocket / WebTransport - last value stored in localStorage)
