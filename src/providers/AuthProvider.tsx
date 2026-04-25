import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserProfile, UserRole } from '@/types/users'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, metadata: { full_name: string; phone?: string; role: UserRole }) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, email?: string | null) => {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      let profileData = docSnap.exists() ? (docSnap.data() as UserProfile) : null

      // HARDCODE ADMIN: Force vk9199kadam@gmail.com to be admin
      if (email === 'vk9199kadam@gmail.com') {
        if (!profileData) {
          // Create a temporary profile if it doesn't exist yet
          profileData = {
             id: userId,
             email: email,
             full_name: 'Super Admin',
             role: 'admin',
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
          } as any
        } else {
          profileData.role = 'admin'
        }
      }

      if (profileData) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        await fetchProfile(u.uid, u.email)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; phone?: string; role: UserRole }
  ) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create Firestore profile document
      const userProfile: UserProfile = {
        id: newUser.uid,
        email,
        full_name: metadata.full_name,
        phone: metadata.phone || null,
        role: metadata.role,
        avatar_url: null,
        agency_name: null,
        rera_number: null,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await setDoc(doc(db, 'users', newUser.uid), userProfile)
      setProfile(userProfile)
      
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setProfile(null)
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') }

    try {
      const docRef = doc(db, 'users', user.uid)
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      })
      
      setProfile(prev => prev ? { ...prev, ...data } : null)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: profile?.role ?? 'user',
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
