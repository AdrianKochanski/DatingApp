using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataApp.API.Data;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    //próba commit
    [ApiController]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;
        public ValuesController(DataContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetValues() {
            var values = await _context.Values.ToListAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id){
            var value = await _context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
        }
        
        [HttpPost]
        public void Post([FromBody] string value) {
        }

        [HttpPut]
        public void Put(int id, [FromBody] string value) {

        }

        [HttpDelete("{id}")]
        public void Delete(int id) {

        }
    }
}
