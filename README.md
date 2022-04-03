# React DB Client

React components that allow simple interfacing with a backend database.

NOTE: This repo contains many components pulled from other projects. It needs some tidying!


## Testing

To enable enzyme testing we need to do some initialization. This should really be
integrated into bit but at the moment the best way to do this is import the following
at the to of the file:

``` js
import '@samnbuk/react_db_client.helpers.enzyme-setup';
```

To test a single component run `bit test <component_id>`. The `component_id` is
the key in the `.bitmap` file