import { expect, test } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/LangFull/)
  await expect(page.locator('h1')).toContainText('LangFull')
  await expect(page.locator('h2')).toContainText('Language Learning with PDFs')
  await expect(page.locator('text=Transform PDFs into interactive language learning experiences')).toBeVisible()
})
