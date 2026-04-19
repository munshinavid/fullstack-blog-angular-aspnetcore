/*
 * ============================================================
 *  IMPROVEMENT #4: Footer Component (TypeScript)
 * ============================================================
 *  Why: Every production blog has a footer. It serves as:
 *  1. A visual "end" to the page (signals content is complete)
 *  2. A place to put links to GitHub, social, and contact info
 *  3. Copyright / branding info
 *
 *  For a portfolio, this is where recruiters find your GitHub link.
 *
 *  Interview Tip: This is a standalone component — it doesn't need
 *  a parent NgModule. Angular's standalone API (v14+) reduces
 *  boilerplate and makes components self-contained.
 * ============================================================
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  // Dynamic copyright year — no need to update manually each year
  currentYear = new Date().getFullYear();
}
