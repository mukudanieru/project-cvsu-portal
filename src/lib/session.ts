import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  accountID: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'cvsu-portal',
    password: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 3600 seconds
    },
  })
}
