package pkg

import (
 "github.com/cassioHilario/rocketseat-go-react-na-pratica/app/constant"
 "github.com/cassioHilario/rocketseat-go-react-na-pratica/app/domain/dto"
)

func Null() interface{} {
 return nil
}

func BuildResponse[T any](responseStatus constant.ResponseStatus, data T) dto.ApiResponse[T] {
 return BuildResponse_(responseStatus.GetResponseStatus(), responseStatus.GetResponseMessage(), data)
}

func BuildResponse_[T any](status string, message string, data T) dto.ApiResponse[T] {
 return dto.ApiResponse[T]{
  ResponseKey:     status,
  ResponseMessage: message,
  Data:            data,
 }
}