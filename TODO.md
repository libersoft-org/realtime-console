# Bugs

- In CSS: .modal .body .buttons elements are having different size (they all are flex-grow: 1, which works, but with a bit different size for each element)
- Modal window width is not growing to 100% - 20px of screen width, when there is a long text in one row in modal body

# Features

- Add a possibility to autoconnect when command is sent and server is not connected
- Add a possibility to move modal window (drag by title bar)
- Add WebTransport support (switch WebSocket / WebTransport - last value stored in localStorage)
