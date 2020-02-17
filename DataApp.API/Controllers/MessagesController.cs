using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DataApp.API.Data;
using DataApp.API.Dtos;
using DataApp.API.Helpers;
using DataApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataApp.API.Controllers
{   
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(
            IDatingRepository repo, 
            IMapper mapper) {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id) {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo == null) return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageFromCreationDto messageFromCreationDto) {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            messageFromCreationDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageFromCreationDto.RecipientId);
            if(recipient == null) return BadRequest("Could not find user");
            var message = _mapper.Map<Message>(messageFromCreationDto);
            
            _repo.Add(message);

            if(await _repo.SaveAll()) {
                return CreatedAtRoute("GetMessage", new {userId, id = message.Id, message});
            }
            
            throw new Exception("Creating the message failed on save");
        }
    }
}