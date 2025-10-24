import { usersService } from './users.service'

export const registerUser = async (req: any, res: any) => {
  try {
    const { user, token } = await usersService.register(req.body)
    res.status(201).json({ user, token })
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json({ error: err.message, details: err.details })
  }
}

export const loginUser = async (req: any, res: any) => {
  try {
    const { publicUser, token } = await usersService.login(req.body)
    res.status(201).json({ publicUser, token })
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json({ error: err.message, details: err.details })
  }
}
