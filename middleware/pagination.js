
function paginated(model, limits, req, res) {
    const page = parseInt(req.query.page);
    const limit = limits;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {};
    if (endIndex < model.length) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    result.totalPages = math.ceil(model.length / limit);
    result.result = model.slice(startIndex, endIndex);
    return result;
  }

  module.exports = {paginated}