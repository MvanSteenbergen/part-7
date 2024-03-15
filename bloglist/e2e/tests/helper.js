const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const postBlogWith = async (page, title, author, url)  => {
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  const responsePromise = page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  await page.getByRole('button', { name: 'add blog' }).click()
  await responsePromise
}

export { loginWith, postBlogWith }