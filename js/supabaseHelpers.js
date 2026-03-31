// js/supabaseHelpers.js
import { supabase } from './supabaseClient.js';

/**
 * Sign up a new user
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Sign up error:', error.message);
    return null;
  }
  return data.user;
}

/**
 * Sign in an existing user
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Sign in error:', error.message);
    return null;
  }
  return data.user;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error.message);
    return false;
  }
  return true;
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
  return data.user;
}

/**
 * Get current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error.message);
    return null;
  }
  return data.session;
}

/**
 * Refresh session token
 */
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Session refresh error:', error.message);
    return false;
  }
  return true;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
