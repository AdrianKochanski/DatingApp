using Microsoft.AspNetCore.SignalR;
using System.Linq;

namespace DataApp.API.HubConfig
{
    public class MyCustomProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User.FindFirst(claim => claim.Type.EndsWith("nameidentifier")).Value;
        }
    }
}