package router

import (
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/config"
	"github.com/gin-gonic/gin"
)

func Init(init *config.Initialization) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	api := router.Group("/api")
	{
		user := api.Group("/user")
		{
			user.GET("", init.UserCtrl.GetAllUserData)
			user.POST("", init.UserCtrl.AddUserData)
			user.GET("/:userID", init.UserCtrl.GetUserById)
			user.PUT("/:userID", init.UserCtrl.UpdateUserData)
			user.DELETE("/:userID", init.UserCtrl.DeleteUser)
		}
		/* room := api.Group("/room")
		{
			room.GET("", init.RoomCtrl.GetAllRoomData)
			room.POST("", init.RoomCtrl.AddAllRoomData)
			question := room.Group("/:roomID/question")
			{
				question.GET("", init.QuestionCtrl.GetAllQuestionData)
				question.POST("", init.QuestionCtrl.AddAllQuestionData)
				question.GET("/:questionID", init.QuestionCtrl.GetQuestionById)
				question.PUT("/:questionID/addReaction", init.QuestionCtrl.AddReaction)
				question.PUT("/:questionID/removeReaction", init.QuestionCtrl.RemoveReaction)
				question.PUT("/:questionID/answer", init.QuestionCtrl.AnswerQuestion)
				question.DELETE("/:questionID", init.QuestionCtrl.DeleteQuestion)
			}
		} */
	}

	return router
}