import styled from 'styled-components'
import { Avatar } from 'components'

const Wrapper = styled.div`
  width: 100%;
`

const WrapperPhotoInput = styled.div`
  display: flex;
  flex-direction: row;
`

const InputWrapper = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  border-radius: 6px;
  width: 100%;
  padding: 20px;
  margin-bottom: 15px;
`

const List = styled.div`

`

const ListItem = styled.div`
  display: flex;
`

const Comment = styled(InputWrapper)`
  margin: 15px 0;
  width: 100%;
`

const AuthorImageOnInput = styled(Avatar)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 15px;
  margin-right: 10px;
`
const AuthorImageOnList = styled(Avatar)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 30px;
  margin-right: 10px;
`

const AuthorName = styled.span`
  display: block;
  color: ${({ theme }) => theme.COLORS.COLOR_BLUE_DOGDER};
  font-weight: 500;
  margin-right: 10px;
  padding-bottom: 5px;
`

export const StyledComments = {
  Wrapper,
  InputWrapper,
  WrapperPhotoInput,
  List,
  ListItem,
  Comment,
  AuthorName,
  AuthorImage: {
    OnInput: AuthorImageOnInput,
    OnList: AuthorImageOnList,
  },
}
