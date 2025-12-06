import React, { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Make sure you have these environment variables in your .env file
const supabaseUrl = process.env.GATSBY_SUPABASE_URL
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const IndexPage = () => {
  const [status, setStatus] = useState("Checking connection...")

  useEffect(() => {
    // Simple query to test connection
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*").limit(1)
        if (error) {
          setStatus(`Error connecting: ${error.message}`)
        } else {
          setStatus("Connected to Supabase successfully!")
        }
      } catch (err) {
        setStatus(`Unexpected error: ${err.message}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Warframe Checklist</h1>
      <p>{status}</p>
    </div>
  )
}

export default IndexPage
