export function checkDailyLimit(req, res, next) {
  const { mainId } = req.params;
  MainCategory.findById(mainId, (err, category) => {
    if (err || !category)
      return res.status(404).send({ message: "ไม่พบด้านหลัก" });
    const lastCompleted = category.completedAt;
    const now = new Date();
    if (
      lastCompleted &&
      now.toDateString() === new Date(lastCompleted).toDateString()
    ) {
      return res.status(403).send({ message: "สามารถทำได้แค่วันละ 1 ครั้ง" });
    }
    next();
  });
}
