import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DfsBinaryGroupFinderTest {

  @Test
  public void testNullImage() {
    DfsBinaryGroupFinder finder = new DfsBinaryGroupFinder();

    assertThrows(NullPointerException.class, () -> {
      finder.findConnectedGroups(null);
    });
  }

  @Test
  public void testNullRow() {
    DfsBinaryGroupFinder finder = new DfsBinaryGroupFinder();

    int[][] image = {
        { 1, 0, 1 },
        null,
        { 0, 1, 0 }
    };

    assertThrows(NullPointerException.class, () -> {
      finder.findConnectedGroups(image);
    });
  }
}