const valueflows = {
  "content":[ 
     { 
        "id":"25a17f39-8844-47bc-b840-24b4898df7fb",
        "name":"Teste 01",
        "createdAt":"2019-10-25 13:28:44",
        "labels":[ 

        ],
        "problems":[ 
           { 
              "id":"91a5de33-d07c-44d2-8202-4b2eee66df00",
              "name":"We don't have integration with PTM",
              "createdAt":"2019-10-25 13:31:11",
              "hypotheses":[ 
                 { 
                    "id":"56636972-c134-4ce9-ace9-22efbe9db33d",
                    "name":"Integrate PTM in login",
                    "description":"<p>Integrate PTM in login</p>",
                    "labels":[ 

                    ],
                    "circlesCount":0
                 }
              ],
              "circlesCount":0
           }
        ],
        "problemsCount":1,
        "hypothesesCount":1,
        "circlesCount":0
     },
  ],
  "page":0,
  "size":20,
  "totalPages":1,
  "last":true
}

const valueflow = {
   "id":"25a17f39-8844-47bc-b840-24b4898df7fb",
   "name":"ITI - BFF",
   "createdAt":"2019-10-25 13:28:44",
   "labels":[ 

   ],
   "problems":[ 
      { 
         "id":"91a5de33-d07c-44d2-8202-4b2eee66df00",
         "name":"Problema 01",
         "createdAt":"2019-10-25 13:31:11",
         "hypotheses":[ 
            { 
               "id":"56636972-c134-4ce9-ace9-22efbe9db33d",
               "name":"Hipotese 01",
               "description":"<p>Problema 01</p>",
               "labels":[ 

               ],
               "circlesCount":0
            }
         ],
         "circlesCount":0
      }
   ],
   "problemsCount":1,
   "hypothesesCount":1,
   "circlesCount":0
}

module.exports = {
  valueflows,
  valueflow,
}
