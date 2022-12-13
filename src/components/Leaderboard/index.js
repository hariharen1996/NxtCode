import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'
import LeaderboardTable from '../LeaderboardTable/index'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiConstant, setAPiConstant] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getLeaderBoardData = async () => {
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }

      setAPiConstant({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const response = await fetch(url, options)
      const responseData = await response.json()

      if (response.ok === true) {
        setAPiConstant(prevState => ({
          ...prevState,
          data: responseData,
          status: apiStatusConstants.success,
        }))
      } else {
        setAPiConstant(prevState => ({
          ...prevState,
          errorMsg: responseData.error_msg,
          status: apiStatusConstants.failure,
        }))
      }
    }
    getLeaderBoardData()
  }, [])

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )
  const renderSuccessView = () => {
    const {data} = apiConstant
    const formattedData = data.leaderboard_data.map(item => ({
      id: item.id,
      rank: item.rank,
      name: item.name,
      profileImgUrl: item.profile_image_url,
      score: item.score,
      language: item.language,
      timeSpent: item.time_spent,
    }))
    return <LeaderboardTable leaderboardData={formattedData} />
  }
  const renderFailureView = () => {
    const {errorMsg} = apiConstant
    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  // Your code goes here...
  const renderLeaderboard = () => {
    const {status} = apiConstant
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
