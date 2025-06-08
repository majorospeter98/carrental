

<template>
<div>
  <header>
    </header>
  <main>
    <router-view></router-view>
  </main>
</div>
</template>

<style>
*{
  margin:0;
  padding: 0;
box-sizing:border-box;
line-height: 1.6;
 font-family: "Inter", sans-serif;
  scroll-behavior: smooth;
}

img{
  height:300px;
  width:310px;
}
body{
background: radial-gradient(circle at center, #38bdf8, #0ea5e9, #0284c7);
color:white;
   background-repeat: none;
   }
:root{
scrollbar-width: thin;
  scrollbar-color: red white;
}
ul{
  list-style:none;
}
li{
  text-decoration: none;
}
.list-group-item {
  background-color: transparent !important;
  color:white;
}
a.router-link-active,
a.router-link-exact-active,
a.router-link{
  color:white
}
</style>
