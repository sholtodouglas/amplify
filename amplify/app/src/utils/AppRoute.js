import React from 'react';
import { Route } from 'react-router-dom';

const AppRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => {

  Layout = (Layout === undefined) ? props => (<React.Fragment>{props.children}</React.Fragment>) : Layout;
  console.log(rest.wallet)
  if (rest.wallet == undefined){
    return (
      <Route
        {...rest}
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )} />
    );
    
  } else {
    return (
      <Route
        {...rest}
        render={props => (
          <Layout>
            <Component {...props} wallet={rest.wallet}/>
          </Layout>
        )} />
    );

  }
  
}

export default AppRoute;