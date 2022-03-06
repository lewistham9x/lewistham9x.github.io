(function () {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function (schemaCallback) {
    // Schema for magnitude and place data
    var pool_cols = [
      {
        id: "id",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "name",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "firstToken",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "secondToken",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "lpToken",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "apr",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "totalStaked",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "created_at",
        dataType: tableau.dataTypeEnum.datetime,
      },
      {
        id: "updated_at",
        dataType: tableau.dataTypeEnum.datetime,
      },
      {
        id: "farm",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "chainName",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "nativeToken",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "masterChef",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "website",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "risk",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "creationDate",
        dataType: tableau.dataTypeEnum.datetime,
      },
    ];

    var poolTable = {
      id: "pool",
      alias: "Pool Data",
      columns: pool_cols,
    };

    schemaCallback([poolTable]);
  };

  // Download the data
  myConnector.getData = function (table, doneCallback) {
    var apiCall = "https://shieldapi.miim.club/pools/cached";

    $.getJSON(apiCall, function (resp) {
      var feat = resp.features,
        tableData = [];

      var i = 0;

      if (table.tableInfo.id == "pool") {
        for (i = 0, len = feat.length; i < len; i++) {
          tableData.push({
            id: feat[i].id,
            name: feat[i].properties.name,
            firstToken: feat[i].properties.firstToken,
            secondToken: feat[i].properties.secondToken,
            lpToken: feat[i].properties.lpToken,
            apr: feat[i].geometry.apr,
            totalStaked: feat[i].geometry.totalStaked,
            created_at: feat[i].geometry.created_at,
            updated_at: feat[i].geometry.updated_at,
            farm: feat[i].geometry.farm,
            chainName: feat[i].geometry.chainName,
            nativeToken: feat[i].geometry.nativeToken,
            masterChef: feat[i].geometry.masterChef,
            website: feat[i].geometry.website,
            risk: feat[i].geometry.risk,
            creationDate: feat[i].geometry.creationDate,
          });
        }
      }

      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function () {
    $("#submitButton").click(function () {
      tableau.connectionData = JSON.stringify(dateObj); // Use this variable to pass data to your getSchema and getData functions
      tableau.connectionName = "Shieldfarm pools data"; // This will be the data source name in Tableau
      tableau.submit(); // This sends the connector object to Tableau
    });
  });
})();
