const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, postBlogWith } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Another User',
        username: 'anotheruser',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    let finder = await page.getByText('blogs')
    await expect(finder).toBeVisible()
    await expect(page.getByText('Login').first()).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen has logged in.')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('Matti Luukkainen has logged in.')).not.toBeVisible()      // ...
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByRole('button', { name: 'New blog' }).click()
      await postBlogWith(page, 'A New Blog', 'An Author', 'http://blog.com/')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByTestId('titleandauthor')).toContainText("A New Blog by An Author")
    })

    test('a new blog can be edited', async ({ page }) => {
      await page.getByRole('button', {name: "view"}).last().click()
      const responsePromise = page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
      await page.getByRole('button', {name: "like"}).last().click()
      await responsePromise
      await expect(page.getByTestId('likes')).toContainText("1")
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', {name: "view"}).last().click()
      const responsePromise = page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 204)
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', {name: "delete"}).last().click()
      await responsePromise
      await expect(page.getByTestId('blog')).not.toBeVisible()
    })

    test('a blog can only be deleted by the user who made it', async ({ page }) => {
      await page.getByTestId('logout').click()
      await loginWith(page, 'anotheruser', 'password')
      await page.getByRole('button', {name: "view"}).last().click()
      await expect(page.getByRole('button', {name: "delete"})).not.toBeVisible()
    })

    test('Blogs are displayed in the correct order', async ({ page }) => {
      await postBlogWith(page, 'An Unpopular Blog', 'An Unpopular Author', 'http://unpopularblog.com')
      await postBlogWith(page, 'A Popular Blog', 'A Popular Author', 'http://popularblog.com/')

      await page.locator('div').filter({ hasText: /^A New Blog by An Authorview$/ }).getByRole('button').click()
      const firstPromise = await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
      page.getByRole('button', { name: 'like' }).click()
      await firstPromise
      await page.locator('div').filter({ hasText: /^A New Blog by An Authorview$/ }).getByRole('button').click()

      await page.locator('div').filter({ hasText: /^A Popular Blog by A Popular Authorview$/ }).getByRole('button').click()
      const secondPromise = await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
      page.getByRole('button', { name: 'like' }).click()
      await secondPromise

      const thirdPromise = await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
      await page.getByRole('button', { name: 'like' }).click()
      await thirdPromise

      await page.locator('div').filter({ hasText: /^A Popular Blog by A Popular Authorview$/ }).getByRole('button').click()


      await expect(page.getByTestId('blog').nth(0)).toContainText(/A Popular Blog by A Popular Author/)
      await expect(page.getByTestId('blog').nth(1)).toContainText(/A New Blog by An Author/)
      await expect(page.getByTestId('blog').nth(2)).toContainText(/An Unpopular Blog by An Unpopular Author/)
    })
  })
})