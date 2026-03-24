import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
	const navigate = useNavigate();
  return (
    <div>Home
        <Link to = "/login"><button >Login </button></Link>
    </div>
  )
}

export default Home