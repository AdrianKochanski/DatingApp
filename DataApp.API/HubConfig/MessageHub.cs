using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DataApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System;

namespace DataApp.API.HubConfig
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        public async Task BroadcastNewMessage(MessageToReturnDto data) {
            foreach (var connectionId in _connections.GetConnections(data.RecipientId.ToString()))
            {
                await Clients.Client(connectionId).SendAsync("newMessage", data);
            }
        }

        public async Task BroadcastNewActivity(UserActivityDto data)
        {
            foreach (var connectionId in _connections.GetConnections(data.RecipientId.ToString()))
            {
                await Clients.Client(connectionId).SendAsync("newActivity", data);
            }
        }
        
        public string GetConnectionId() => Context.ConnectionId;

        public override Task OnConnectedAsync() {
            _connections.Add(Context.UserIdentifier, Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception) {
            _connections.Remove(Context.UserIdentifier, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}