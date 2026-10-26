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
}