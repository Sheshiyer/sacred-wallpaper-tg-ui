sequenceDiagram
    participant U as User
    participant B as Bot
    participant M as Mini App
    participant A as Backend API
    participant S as Stripe/Payments

    U->>B: /start command
    B->>U: Welcome message + Mini App button
    U->>M: Open Mini App
    M->>A: Verify user
    A->>M: User status

    alt New User
        M->>U: Request birth data
        U->>M: Submit birth data
        M->>A: Store user data
        A->>M: Confirmation
    end

    M->>U: Show subscription options
    U->>M: Select plan
    M->>S: Create payment
    S->>U: Payment interface
    U->>S: Complete payment
    S->>A: Payment confirmation
    A->>M: Update subscription
    M->>U: Show generator interface

    loop Wallpaper Generation
        U->>M: Configure wallpaper
        M->>A: Generate request
        A->>M: Wallpaper URL
        M->>U: Preview wallpaper
        U->>M: Approve/Share
        M->>B: Send wallpaper
        B->>U: Deliver wallpaper
    end

    U->>M: View biorhythm
    M->>A: Fetch calculations
    A->>M: Current patterns
    M->>U: Display visualization

    U->>M: View wallpaper history
    M->>A: Fetch wallpaper history
    A->>M: Wallpaper history
    M->>U: Display wallpaper history