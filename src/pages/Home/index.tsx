import { Components } from 'components';

const Home = () => {
  return (
    <div className="container my-4 flex justify-center px-4">
      <Components.PostList className="md:w-8/12">
        <Components.AddPost />
      </Components.PostList>
    </div>
  );
};

export default Home;
