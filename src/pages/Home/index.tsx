import { Components } from 'components';

const Home = () => {
  return (
    <div className="my-4 grid grid-cols-1 px-4 md:grid-cols-4 lg:container">
      <Components.PostList>
        <Components.AddPost />
      </Components.PostList>
      <Components.UsersList />
    </div>
  );
};

export default Home;
