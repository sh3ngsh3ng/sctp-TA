popular,spicy,hot
["popular", "spicy", "hot"]

let userString = spaghetti,eggs

userString.split(",")                              => ["spaghetti" , "eggs"]
userString.split(",").map(i => new RegExp(i, 'i')) => [/spaghetti/i , /eggs/i]

SPag
spag
sPAG
spaG