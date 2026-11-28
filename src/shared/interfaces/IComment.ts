import { type IUserImage } from './IUser';

export interface IComment {
  postId: string;
  creatorId: string;
  content: string;
  creator: IUserImage;
  createdAt: string;
  updatedAt: string;
}
