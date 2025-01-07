import os
import hmac
import hashlib
import json
from datetime import datetime
from typing import Dict, Any

from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ContextTypes,
    filters
)

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-webapp-url.com")
BOT_SECRET = os.getenv("BOT_SECRET", "your-secret-key")  # For validating WebApp data

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send welcome message with Mini App button when the command /start is issued."""
    keyboard = [
        [InlineKeyboardButton(
            "🎨 Open Sacred Wallpaper Pack",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = (
        "Welcome to Sacred Wallpaper Pack! 🌟\n\n"
        "Generate consciousness-optimizing wallpapers based on your biorhythms.\n\n"
        "Click the button below to start your journey."
    )
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)

def validate_webapp_data(init_data: str) -> bool:
    """Validate the data received from WebApp."""
    try:
        # Parse the init data
        data_dict = dict(param.split('=') for param in init_data.split('&'))
        
        # Get the hash and remove it from the data
        received_hash = data_dict.pop('hash')
        
        # Sort the data alphabetically
        data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(data_dict.items()))
        
        # Calculate secret key hash
        secret_key = hmac.new(
            BOT_SECRET.encode(),
            msg=b'WebAppData',
            digestmod=hashlib.sha256
        ).digest()
        
        # Calculate data hash
        data_hash = hmac.new(
            secret_key,
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        
        return data_hash == received_hash
    except Exception:
        return False

async def handle_webapp_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle data received from the WebApp."""
    try:
        # Validate the data
        if not validate_webapp_data(update.effective_message.web_app_data.data):
            await update.message.reply_text("❌ Invalid data received.")
            return

        # Parse the data
        data = json.loads(update.effective_message.web_app_data.data)
        
        if data.get('type') == 'wallpaper':
            # Handle wallpaper sharing
            image_url = data.get('url')
            caption = data.get('caption', '')
            
            # Send the wallpaper back to the chat
            await update.message.reply_photo(
                photo=image_url,
                caption=f"🎨 Your Sacred Wallpaper\n\n{caption}"
            )
        else:
            await update.message.reply_text("❌ Unknown data type received.")
            
    except Exception as e:
        await update.message.reply_text(f"❌ Error processing WebApp data: {str(e)}")

async def generate_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the /generate command."""
    keyboard = [
        [InlineKeyboardButton(
            "🎨 Generate New Wallpaper",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/generate")
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Click below to generate a new wallpaper:",
        reply_markup=reply_markup
    )

async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the /profile command."""
    keyboard = [
        [InlineKeyboardButton(
            "👤 View Profile",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/profile")
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Click below to view your profile:",
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    help_text = (
        "🌟 Sacred Wallpaper Pack Commands:\n\n"
        "/start - Open the main menu\n"
        "/generate - Generate a new wallpaper\n"
        "/profile - View your profile\n"
        "/help - Show this help message"
    )
    await update.message.reply_text(help_text)

def main() -> None:
    """Start the bot."""
    # Create the Application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Add command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("generate", generate_command))
    application.add_handler(CommandHandler("profile", profile_command))
    application.add_handler(CommandHandler("help", help_command))
    
    # Add WebApp data handler
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_webapp_data))

    # Start the Bot
    application.run_polling()

if __name__ == '__main__':
    main()
