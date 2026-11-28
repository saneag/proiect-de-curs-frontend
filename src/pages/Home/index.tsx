import { Components } from 'components';

const Home = () => {
  return (
    <Components.PageLayout>
      <Components.PostList>
        <Components.AddPost />
      </Components.PostList>
    </Components.PageLayout>
  );
};

export default Home;
