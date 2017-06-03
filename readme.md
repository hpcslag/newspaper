# Newspaper
Newspaper is a blog website based by `Node.js`, let you focus to write the article for student, this project is for school or department to publish their knowledge.

# Install
```sh
npm install -g nwsp
```

and you have to setup nwsp (follow the command line question):
```sh
nwsp init
```

install in global(-g) meaning the `public` folder will install on the `-g` folder. (please take a note)

# Require
 - MongoDB 
 - Node.js Version 6 or higher

# Install On Local
You can also install website on local path.
```sh
git clone https://github.com/hpcslag/newspaper.git
cd newspaper
npm install .
npm start
```

# Folder Description
`/public/upload` this folder is for author upload images.

# Manual Setup Configure.json
`/configure.json` is website config file, you can modify it.

# Usage
`localhost:3000/explore` - All articles are show in here.
`localhost:3000/article?id=xxx` - Article Page.
`localhost:3000/admin/user/login` - Admin Login.
`localhost:3000/admin/dashboard` - Admin Dashboard(Press `ASDF` can let you be super admin).
`localhost:3000/admin/setting` - Setup admin password

# Setup Admin Account.

### Create Admin User
In global mod, you can use this command to create admin user:
```sh
nwsp createUser
```
In local mod, you can use this command to create admin user:
```sh
node ./bin/nwsp createUser
```

### Delete User
If you press all-- , it will delete all author(admin) in database.
```
nwsp deleteUser
```

### Listing Admin Users
Show all users in database.
```
nwsp listUser
```

### help
```
nwsp help
```



# TODO List:
 - Generate Static File for github pages.
 - Support select target folder.
 - RSS
 - Hashtag
 - Mailing
 - Custom Stylesheet Template
 - Disquz
 - Support Full i18n
