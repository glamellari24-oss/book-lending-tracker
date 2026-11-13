# Book Lending Tracker — Group B

A static HTML, CSS and JavaScript project. All CSS is provided by the reusable local styles.css library. BookLibrary is the JavaScript data library; LoanApp handles the interface. No external dependencies.

## Run
Open the folder in Visual Studio Code. Open index.html in a browser, or use Live Server. Loans are stored in this browser using localStorage. Return removes a completed loan from the active list. Dates before today are overdue; today is still on loan. Past dates are allowed to record existing overdue loans.

## GitHub: required first commit
Create a PUBLIC repository named book-lending-tracker on GitHub without a README. Replace YOUR_USERNAME below. In the VS Code terminal:

```bash
git clone https://github.com/YOUR_USERNAME/book-lending-tracker.git
cd book-lending-tracker
```
Create EMPTY index.html, styles.css and app.js inside the cloned folder, then run:

```bash
git add index.html styles.css app.js
git commit -m "Create initial empty project files"
git branch -M main
git push -u origin main
```
## Add features through a Pull Request
After the empty-file commit has been pushed to main, create a feature branch:

```bash
git switch -c feature/book-lending-tracker
```
Copy the completed files from this download into the cloned folder, replacing the empty files. Then run:

```bash
git add .
git commit -m "Build book lending tracker"
git push -u origin feature/book-lending-tracker
```
Open a Pull Request on GitHub from feature/book-lending-tracker into main. Review the changes and merge the Pull Request. Every subsequent feature must also use a feature branch and a Pull Request; do not push feature changes directly to main.

All five fields, including Genre, are required. The custom error appears beside each invalid field.

## Cloudflare
Deploy the folder containing index.html, styles.css and app.js as a static Cloudflare Pages project, or connect the GitHub repository. No build command or dependencies are required. The published directory must contain index.html at its root.

Submit your actual public GitHub repository URL and the Cloudflare deployment URL after publishing. This download does not create accounts, a remote repository or a deployment.

## Manual checks
Submit an empty form: custom messages appear beside all required fields. Add a valid loan: it appears in the table and total increases. Add a past due date: overdue increases. Reload: loans remain. Return a book: row disappears and counters update. Narrow screen: the form stacks and table scrolls.
