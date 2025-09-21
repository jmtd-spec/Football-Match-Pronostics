# Football-Match-Pronostics
echo "# Football-Match-Pronostics" >> README.md
Football Predictions Sales Website
This is a React-based web application for selling daily football match predictions. It features two distinct packages, a dynamic sales page with a countdown timer, a checkout system, and an admin panel for managing predictions.

Features
Public-Facing Website
•	Daily Football Predictions: Displays two packages for purchase:
◦	Starter Kit (€9.99): 5 top daily predictions, non-refundable.
◦	Joker (€15.99): 2 match predictions with minimum odds of 1.4 (2/5), money-back guarantee if both predictions fail.
•	Dynamic Content: Real-time countdown timer to the next predictions and current date display.
•	"No Predictions Available" Message: Informs visitors when predictions are not available for the day.
•	Checkout System: Collects email and optional phone number, simulates payment processing, and provides a success confirmation with a receipt download option.
•	Responsive Design: Optimized for various screen sizes.

Admin Panel
•	Prediction Management: Add, edit, and delete individual match predictions.
•	Bulk Upload: Upload multiple predictions using a CSV file.
•	Prediction Status Toggle: Enable/disable the display of predictions on the main page, showing a "No Predictions Available" message when disabled.
•	Simulated Statistics: View basic sales and user statistics.

Technologies Used
•	Frontend: React.js
•	Styling: Tailwind CSS
•	UI Components: shadcn/ui
•	Icons: Lucide React

Getting Started
To run this project locally, follow these steps:

1	Clone the repository:
git clone <repository-url>
cd football-predictions
2	Install dependencies:
pnpm install
3	Start the development server:
pnpm run dev
4	The application will be available at http://localhost:5173.

Usage
Public Website
Navigate to the home page to view the available prediction packages. Click on a package to proceed to the checkout. After entering your details, a simulated payment process will occur, followed by a success message.

Admin Panel
Access the Admin Panel by clicking the "Admin Panel" button at the bottom right of the public website. From there, you can manage predictions, upload new ones, and toggle the prediction status.

Deployment
This application is designed to be deployed as a static React application. After building the project, the dist folder can be served by any static file server.

# Build for production
pnpm run build

The dist directory will contain the production-ready files.

Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

License
MIT

